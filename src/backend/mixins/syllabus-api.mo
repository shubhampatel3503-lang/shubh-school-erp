import Map          "mo:core/Map";
import List         "mo:core/List";
import Text         "mo:core/Text";
import Time         "mo:core/Time";
import SyllabusTypes "../types/syllabus";

/// Syllabus content, built-in Q&A generator, and principal approval workflow.
mixin (
  syllabusContents : Map.Map<Text, SyllabusTypes.SyllabusContent>,
  chapters : Map.Map<Text, {
    id : Text; subjectId : Text; chapterNo : Nat; title : Text;
    topics : [Text]; completionPercent : Nat; classLevel : Text;
  }>,
) {

  // ── Internal helpers ─────────────────────────────────────────────────────

  func truncate(t : Text, maxLen : Nat) : Text {
    if (t.size() <= maxLen) { t } else {
      let arr = t.toArray();
      Text.fromArray(arr.sliceToArray(0, maxLen)) # "..."
    }
  };

  /// Built-in Q&A generator: analyses plain text, returns up to 15 Q&A pairs.
  /// Built-in Q&A generator: for each userQuestion, searches contentText for
  /// relevant sentences and constructs a best-effort answer from the content.
  /// Falls back to free-form analysis when no user questions are provided.
  func generateQAFromText(content : Text, userQuestions : [Text]) : [SyllabusTypes.QAPair] {
    // If teacher provided questions, answer each one from the content.
    if (userQuestions.size() > 0) {
      return userQuestions.map<Text, SyllabusTypes.QAPair>(func(q : Text) : SyllabusTypes.QAPair {
        { question = q; answer = buildAnswerFromContent(q, content) }
      });
    };

    // Fallback: extract up to 15 Q&A pairs from the content automatically.
    let result = List.empty<SyllabusTypes.QAPair>();
    let MAX_PAIRS : Nat = 15;

    let sentences = List.empty<Text>();
    for (line in content.split(#char('\n'))) {
      let trimLine = line.trim(#char(' '));
      if (not trimLine.isEmpty()) {
        for (sent in trimLine.split(#char('.'))) {
          let s = sent.trim(#char(' '));
          if (s.size() > 10) { sentences.add(s) };
        };
      };
    };
    let sentArr = sentences.toArray();

    let defKws : [Text] = [" is ", " are ", " means ", " defined as", " refers to", " called "];
    for (sent in sentArr.values()) {
      if (result.size() < MAX_PAIRS) {
        let lower = sent.toLower();
        var matched = false;
        for (kw in defKws.values()) {
          if (not matched and lower.contains(#text kw)) {
            matched := true;
            let q = "Explain: " # truncate(sent, 70) # "?";
            result.add({ question = q; answer = sent });
          };
        };
      };
    };

    var idx : Nat = 0;
    for (sent in sentArr.values()) {
      if (result.size() < MAX_PAIRS and idx < sentArr.size()) {
        let alreadyCovered = result.any(func(qa : SyllabusTypes.QAPair) : Bool {
          qa.answer == sent
        });
        if (not alreadyCovered and sent.size() > 20) {
          let q = "What does the following statement explain? " # truncate(sent, 60);
          result.add({ question = q; answer = sent });
        };
      };
      idx += 1;
    };

    result.toArray()
  };

  /// Keyword-extraction answer builder: splits the question into keywords,
  /// finds content sentences that contain the most keywords, and combines
  /// the top matching sentences into a cohesive answer.
  func buildAnswerFromContent(question : Text, content : Text) : Text {
    // Extract keywords from the question (words >= 3 chars, skip stop words)
    let stopWords : [Text] = ["the", "what", "which", "when", "where", "who",
      "why", "how", "are", "is", "was", "were", "does", "did", "has", "have",
      "can", "will", "would", "should", "could", "and", "but", "for", "with",
      "about", "from", "that", "this", "these", "those", "its", "their",
      "means", "explain", "describe", "define", "list", "name", "give",
      "write", "state", "what"];
    let qLower = question.toLower();
    let keywords = List.empty<Text>();
    for (token in qLower.split(#char(' '))) {
      let w = token.trim(#char(' '))
                   .trim(#char('?'))
                   .trim(#char(','))
                   .trim(#char('.'));
      if (w.size() >= 3) {
        let isStop = stopWords.find(func(s : Text) : Bool { s == w }) != null;
        if (not isStop) { keywords.add(w) };
      };
    };

    // Split content into sentences and score each by keyword match count
    let scoredSents = List.empty<(Nat, Text)>();
    for (line in content.split(#char('\n'))) {
      let trimLine = line.trim(#char(' '));
      if (not trimLine.isEmpty()) {
        for (sent in trimLine.split(#char('.'))) {
          let s = sent.trim(#char(' '));
          if (s.size() > 10) {
            let sLower = s.toLower();
            var score : Nat = 0;
            for (kw in keywords.values()) {
              if (sLower.contains(#text kw)) { score += 1 };
            };
            if (score > 0) { scoredSents.add((score, s)) };
          };
        };
      };
    };

    if (scoredSents.isEmpty()) {
      return "Based on the chapter content, this topic requires further study of the provided material.";
    };

    // Sort descending by score and take top 3 sentences
    scoredSents.sortInPlace(func((a, _) : (Nat, Text), (b, _2) : (Nat, Text)) : { #less; #equal; #greater } {
      if (a > b) #less else if (a == b) #equal else #greater
    });
    let top = List.empty<Text>();
    var taken : Nat = 0;
    for ((_, s) in scoredSents.values()) {
      if (taken < 3) { top.add(s); taken += 1 };
    };
    top.values().join(". ") # "."
  };

  func defaultContent(chapterId : Text) : SyllabusTypes.SyllabusContent = {
    chapterId;
    contentText           = "";
    userProvidedQuestions = [];
    generatedQA           = [];
    savedQA               = [];
    approvalStatus        = "draft";
    rejectionReason       = null;
    submittedAt           = null;
    approvedAt            = null;
  };

  // ── Public API ─────────────────────────────────────────────────────────────

  public shared func addChapterContent(chapterId : Text, contentText : Text) : async () {
    let current = switch (syllabusContents.get(chapterId)) {
      case (?c) c;
      case null defaultContent(chapterId);
    };
    syllabusContents.add(chapterId, { current with contentText });
  };

  public query func getChapterContent(chapterId : Text) : async ?SyllabusTypes.SyllabusContent {
    syllabusContents.get(chapterId)
  };

  public shared func generateChapterQA(
    chapterId     : Text,
    contentText   : Text,
    userQuestions : [Text]
  ) : async [SyllabusTypes.QAPair] {
    let current = switch (syllabusContents.get(chapterId)) {
      case (?c) c;
      case null defaultContent(chapterId);
    };
    // Save the incoming contentText and userProvidedQuestions as well
    let updatedContent = if (contentText.size() > 0) contentText else current.contentText;
    let updatedQuestions = if (userQuestions.size() > 0) userQuestions else current.userProvidedQuestions;
    let qas = generateQAFromText(updatedContent, updatedQuestions);
    syllabusContents.add(chapterId, {
      current with
      contentText           = updatedContent;
      userProvidedQuestions = updatedQuestions;
      generatedQA           = qas;
    });
    qas
  };

  public shared func saveChapterQA(
    chapterId     : Text,
    qas           : [SyllabusTypes.QAPair],
    userQuestions : [Text]
  ) : async () {
    let current = switch (syllabusContents.get(chapterId)) {
      case (?c) c;
      case null defaultContent(chapterId);
    };
    let updatedQuestions = if (userQuestions.size() > 0) userQuestions else current.userProvidedQuestions;
    syllabusContents.add(chapterId, {
      current with
      savedQA               = qas;
      userProvidedQuestions = updatedQuestions;
    });
  };

  public shared func submitChapterForApproval(chapterId : Text) : async () {
    switch (syllabusContents.get(chapterId)) {
      case (?c) {
        syllabusContents.add(chapterId, {
          c with
          approvalStatus = "pending_approval";
          submittedAt    = ?Time.now();
          rejectionReason = null;
        });
      };
      case null {};
    }
  };

  public shared func approveChapter(chapterId : Text) : async () {
    switch (syllabusContents.get(chapterId)) {
      case (?c) {
        syllabusContents.add(chapterId, {
          c with
          approvalStatus = "published";
          approvedAt     = ?Time.now();
        });
      };
      case null {};
    }
  };

  public shared func rejectChapter(chapterId : Text, reason : Text) : async () {
    switch (syllabusContents.get(chapterId)) {
      case (?c) {
        syllabusContents.add(chapterId, {
          c with
          approvalStatus  = "rejected";
          rejectionReason = ?reason;
        });
      };
      case null {};
    }
  };
  // ── V2 Workflow aliases (same storage, cleaner naming) ────────────────────

  public shared func submitChapterForApprovalV2(chapterId : Text) : async () {
    switch (syllabusContents.get(chapterId)) {
      case (?c) {
        syllabusContents.add(chapterId, {
          c with
          approvalStatus  = "pending_approval";
          submittedAt     = ?Time.now();
          rejectionReason = null;
        });
      };
      case null {};
    }
  };

  public shared func approveChapterV2(chapterId : Text) : async () {
    switch (syllabusContents.get(chapterId)) {
      case (?c) {
        syllabusContents.add(chapterId, {
          c with
          approvalStatus = "published";
          approvedAt     = ?Time.now();
        });
      };
      case null {};
    }
  };

  public shared func rejectChapterV2(chapterId : Text, reason : Text) : async () {
    switch (syllabusContents.get(chapterId)) {
      case (?c) {
        syllabusContents.add(chapterId, {
          c with
          approvalStatus  = "rejected";
          rejectionReason = ?reason;
        });
      };
      case null {};
    }
  };

  /// For each user-provided question, generate an answer from the chapter content.
  /// Returns [{question: Text, answer: Text}] — one answer per input question.
  public query func generateQAFromContent(
    contentText   : Text,
    userQuestions : [Text]
  ) : async [SyllabusTypes.QAPair] {
    userQuestions.map(func(q : Text) : SyllabusTypes.QAPair {
      { question = q; answer = buildAnswerFromContent(q, contentText) }
    })
  };

  /// Returns published chapters for a given classId and subjectId — student-portal view.
  public query func getPublishedChaptersForStudent(
    classId   : Text,
    subjectId : Text,
  ) : async [SyllabusTypes.ChapterWithQA] {
    let result = List.empty<SyllabusTypes.ChapterWithQA>();
    for ((_, chapter) in chapters.entries()) {
      if (chapter.subjectId == subjectId and chapter.classLevel == classId) {
        switch (syllabusContents.get(chapter.id)) {
          case (?c) {
            if (c.approvalStatus == "published") {
              let qas : [SyllabusTypes.QAPair] =
                if (c.savedQA.size() > 0) { c.savedQA } else { c.generatedQA };
              result.add({
                chapterId             = chapter.id;
                subjectId             = chapter.subjectId;
                classLevel            = chapter.classLevel;
                chapterNo             = chapter.chapterNo;
                title                 = chapter.title;
                topics                = chapter.topics;
                completionPercent     = chapter.completionPercent;
                userProvidedQuestions = c.userProvidedQuestions;
                qas;
                approvalStatus        = c.approvalStatus;
              });
            };
          };
          case null {};
        };
      };
    };
    result.toArray()
  };

  public query func getChapterApprovalStatus(chapterId : Text) : async { status : Text; reason : ?Text } {
    switch (syllabusContents.get(chapterId)) {
      case (?c) { { status = c.approvalStatus; reason = c.rejectionReason } };
      case null { { status = "draft"; reason = null } };
    }
  };

  public query func getPublishedChapters(subjectId : Text, classLevel : ?Text) : async [SyllabusTypes.ChapterWithQA] {
    let result = List.empty<SyllabusTypes.ChapterWithQA>();
    for ((_, chapter) in chapters.entries()) {
      // Filter by subjectId; optionally also filter by classLevel
      let subjectMatch = chapter.subjectId == subjectId;
      let classMatch = switch (classLevel) {
        case (?cl) chapter.classLevel == cl;
        case null  true;
      };
      if (subjectMatch and classMatch) {
        let (qas, userQs, status) : ([SyllabusTypes.QAPair], [Text], Text) =
          switch (syllabusContents.get(chapter.id)) {
            case (?c) {
              let q : [SyllabusTypes.QAPair] = if (c.savedQA.size() > 0) c.savedQA else c.generatedQA;
              (q, c.userProvidedQuestions, c.approvalStatus)
            };
            case null ([], [], "draft");
          };
        if (status == "published") {
          result.add({
            chapterId             = chapter.id;
            subjectId             = chapter.subjectId;
            classLevel            = chapter.classLevel;
            chapterNo             = chapter.chapterNo;
            title                 = chapter.title;
            topics                = chapter.topics;
            completionPercent     = chapter.completionPercent;
            userProvidedQuestions = userQs;
            qas;
            approvalStatus        = status;
          });
        };
      };
    };
    result.toArray()
  };

  public query func getSyllabusContent(chapterId : Text) : async ?SyllabusTypes.SyllabusContent {
    syllabusContents.get(chapterId)
  };

  /// Associate a chapter with a class level for student portal filtering.
  public shared func setChapterClassLevel(chapterId : Text, classLevel : Text) : async () {
    switch (chapters.get(chapterId)) {
      case (?c) { chapters.add(chapterId, { c with classLevel }) };
      case null {};
    }
  };
}
