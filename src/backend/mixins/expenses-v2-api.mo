import Debug "mo:core/Debug";
import Map "mo:core/Map";
import ETypes "../types/expenses-v2";

/// Public API mixin for the Expenses & Income module (v2 — real data, Float amounts).
mixin (
  expenseHeadsV2  : Map.Map<Text, ETypes.ExpenseHead>,
  expenseEntriesV2 : Map.Map<Text, ETypes.ExpenseEntry>,
  genExpenseId    : { var value : Nat },
) {

  // ── Expense Heads ────────────────────────────────────────────────────────

  /// Add a new expense/income category head.
  public shared func addExpenseHeadV2(
    name   : Text,
    type_  : Text,   // "income" | "expense"
    color  : Text,
  ) : async ETypes.ExpenseHead {
    Debug.todo()
  };

  /// Update an existing expense/income head.
  public shared func updateExpenseHeadV2(
    id     : Text,
    name   : Text,
    type_  : Text,
    color  : Text,
  ) : async { #ok : Text; #err : Text } {
    Debug.todo()
  };

  /// Delete an expense/income head (and all its entries).
  public shared func deleteExpenseHeadV2(
    id : Text,
  ) : async { #ok : Text; #err : Text } {
    Debug.todo()
  };

  /// Return all expense/income heads.
  public query func getExpenseHeadsV2() : async [ETypes.ExpenseHead] {
    Debug.todo()
  };

  // ── Expense Entries ──────────────────────────────────────────────────────

  /// Add a new expense or income entry.
  public shared func addExpenseEntryV2(
    headId      : Text,
    amount      : Float,
    date        : Text,
    description : Text,
    createdBy   : Text,
  ) : async ETypes.ExpenseEntry {
    Debug.todo()
  };

  /// Update an existing expense entry.
  public shared func updateExpenseEntryV2(
    id          : Text,
    headId      : Text,
    amount      : Float,
    date        : Text,
    description : Text,
  ) : async { #ok : Text; #err : Text } {
    Debug.todo()
  };

  /// Delete an expense entry.
  public shared func deleteExpenseEntryV2(
    id : Text,
  ) : async { #ok : Text; #err : Text } {
    Debug.todo()
  };

  /// Return all expense entries, optionally filtered by headId.
  public query func getExpenseEntriesV2(
    headId : ?Text,
  ) : async [ETypes.ExpenseEntry] {
    Debug.todo()
  };

  // ── Statistics ───────────────────────────────────────────────────────────

  /// Return aggregated income vs expense totals.
  public query func getExpenseStats() : async ETypes.ExpenseStats {
    Debug.todo()
  };

}
