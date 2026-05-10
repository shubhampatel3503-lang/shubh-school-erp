module {
  public type QAPair = {
    question : Text;
    answer   : Text;
  };

  public type SyllabusContent = {
    chapterId             : Text;
    contentText           : Text;
    userProvidedQuestions : [Text];   // questions entered by teacher from the book
    generatedQA           : [QAPair]; // AI answers keyed to userProvidedQuestions
    savedQA               : [QAPair]; // teacher-edited final Q&A
    approvalStatus        : Text;     // "draft" | "pending_approval" | "published" | "rejected"
    rejectionReason       : ?Text;
    submittedAt           : ?Int;
    approvedAt            : ?Int;
  };

  public type ChapterWithQA = {
    chapterId             : Text;
    subjectId             : Text;
    classLevel            : Text;     // class association for student portal filtering
    chapterNo             : Nat;
    title                 : Text;
    topics                : [Text];
    completionPercent     : Nat;
    userProvidedQuestions : [Text];
    qas                   : [QAPair];
    approvalStatus        : Text;
  };
}
