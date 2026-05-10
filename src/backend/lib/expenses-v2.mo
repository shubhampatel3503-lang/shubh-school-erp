import Debug "mo:core/Debug";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Types "./expenses-v2";

/// Domain logic for the Expenses & Income module.
module {

  /// Create a new ExpenseHead.
  public func createHead(
    heads     : Map.Map<Text, Types.ExpenseHead>,
    genId     : () -> Text,
    name      : Text,
    type_     : Text,
    color     : Text,
    createdAt : Text,
  ) : Types.ExpenseHead {
    Debug.todo()
  };

  /// Update an existing ExpenseHead.
  public func updateHead(
    heads  : Map.Map<Text, Types.ExpenseHead>,
    id     : Text,
    name   : Text,
    type_  : Text,
    color  : Text,
  ) : Bool {
    Debug.todo()
  };

  /// Delete an ExpenseHead and all its entries.
  public func deleteHead(
    heads   : Map.Map<Text, Types.ExpenseHead>,
    entries : Map.Map<Text, Types.ExpenseEntry>,
    id      : Text,
  ) : () {
    Debug.todo()
  };

  /// Create a new ExpenseEntry.
  public func createEntry(
    entries     : Map.Map<Text, Types.ExpenseEntry>,
    genId       : () -> Text,
    headId      : Text,
    amount      : Float,
    date        : Text,
    description : Text,
    createdAt   : Text,
    createdBy   : Text,
  ) : Types.ExpenseEntry {
    Debug.todo()
  };

  /// Update an existing ExpenseEntry.
  public func updateEntry(
    entries     : Map.Map<Text, Types.ExpenseEntry>,
    id          : Text,
    headId      : Text,
    amount      : Float,
    date        : Text,
    description : Text,
  ) : Bool {
    Debug.todo()
  };

  /// Delete an ExpenseEntry.
  public func deleteEntry(
    entries : Map.Map<Text, Types.ExpenseEntry>,
    id      : Text,
  ) : () {
    Debug.todo()
  };

  /// Compute aggregate income/expense statistics.
  public func computeStats(
    heads   : Map.Map<Text, Types.ExpenseHead>,
    entries : Map.Map<Text, Types.ExpenseEntry>,
  ) : Types.ExpenseStats {
    Debug.todo()
  };

}
