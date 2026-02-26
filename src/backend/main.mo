import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

actor {
  type UserProfile = {
    username : Text;
    passwordHash : Text;
    dob : Int;
    displayName : Text;
    ageVerified : Bool;
    verifiedAge : ?Nat;
    parentalControls : ParentalControls;
    cameraVerification : Bool;
  };

  module UserProfile {
    public func compare(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Text.compare(profile1.username, profile2.username);
    };
  };

  type ParentalControls = {
    contentFilterEnabled : Bool;
    maxAgeRating : Nat;
  };

  public type UpdateUserProfileResponse = {
    #usernameAlreadyExists;
    #success;
    #registerNotFound;
    #wrongPassword;
  };

  public type UserExistsResponse = {
    #usernameAlreadyExists;
    #registerNotFound;
  };

  let userProfilesMap = Map.empty<Text, UserProfile>();

  // Use a Set instead of List for admin usernames
  let adminUsernames = Set.empty<Text>();
  adminUsernames.add("superadmin");

  // Add a new user to the system
  public shared ({ caller }) func register(username : Text, passwordHash : Text, dob : Int) : async UpdateUserProfileResponse {
    if (userProfilesMap.containsKey(username)) {
      return #usernameAlreadyExists;
    };

    let userProfile : UserProfile = {
      username;
      passwordHash;
      dob;
      displayName = username;
      ageVerified = false;
      verifiedAge = null;
      parentalControls = {
        contentFilterEnabled = true;
        maxAgeRating = 13;
      };
      cameraVerification = false;
    };

    userProfilesMap.add(username, userProfile);
    #success;
  };

  // Authenticate a user and retrieve their profile
  public query ({ caller }) func login(username : Text, passwordHash : Text) : async ?UserProfile {
    switch (userProfilesMap.get(username)) {
      case (null) { null };
      case (?userProfile) {
        if (userProfile.passwordHash == passwordHash) {
          ?userProfile;
        } else {
          Runtime.trap("Incorrect password for user " # username);
        };
      };
    };
  };

  // Update a user's display name after age verification
  public shared ({ caller }) func updateDisplayName(username : Text, newDisplayName : Text) : async Bool {
    switch (userProfilesMap.get(username)) {
      case (null) { false };
      case (?userProfile) {
        if (userProfile.ageVerified) {
          let updatedProfile = {
            username = userProfile.username;
            passwordHash = userProfile.passwordHash;
            dob = userProfile.dob;
            displayName = newDisplayName;
            ageVerified = userProfile.ageVerified;
            verifiedAge = userProfile.verifiedAge;
            parentalControls = userProfile.parentalControls;
            cameraVerification = userProfile.cameraVerification;
          };
          userProfilesMap.add(username, updatedProfile);
          true;
        } else { false };
      };
    };
  };

  // Update a user's parental controls settings
  public shared ({ caller }) func updateParentalControls(username : Text, contentFilterEnabled : Bool, maxAgeRating : Nat) : async Bool {
    switch (userProfilesMap.get(username)) {
      case (null) { false };
      case (?userProfile) {
        let updatedProfile = {
          username = userProfile.username;
          passwordHash = userProfile.passwordHash;
          dob = userProfile.dob;
          displayName = userProfile.displayName;
          ageVerified = userProfile.ageVerified;
          verifiedAge = userProfile.verifiedAge;
          parentalControls = {
            contentFilterEnabled;
            maxAgeRating;
          };
          cameraVerification = userProfile.cameraVerification;
        };
        userProfilesMap.add(username, updatedProfile);
        true;
      };
    };
  };

  // Update a user's camera verification setting
  public shared ({ caller }) func updateCameraVerification(username : Text, cameraEnabled : Bool) : async Bool {
    if (adminUsernames.contains(username)) {
      Runtime.trap("User " # username # " is an admin and cannot update camera verification settings");
    };

    switch (userProfilesMap.get(username)) {
      case (null) { false };
      case (?userProfile) {
        let updatedProfile = {
          username = userProfile.username;
          passwordHash = userProfile.passwordHash;
          dob = userProfile.dob;
          displayName = userProfile.displayName;
          ageVerified = userProfile.ageVerified;
          verifiedAge = userProfile.verifiedAge;
          parentalControls = userProfile.parentalControls;
          cameraVerification = cameraEnabled;
        };
        userProfilesMap.add(username, updatedProfile);
        true;
      };
    };
  };

  // Check if a username is already taken
  public query ({ caller }) func isUsernameTaken(username : Text) : async Bool {
    userProfilesMap.containsKey(username);
  };

  // Get user profile by username
  public query ({ caller }) func getUserProfile(username : Text) : async ?UserProfile {
    userProfilesMap.get(username);
  };

  // Add a new admin user
  public shared ({ caller }) func addAdmin(username : Text) : async Bool {
    if (adminUsernames.contains(username)) {
      false;
    } else {
      adminUsernames.add(username);
      true;
    };
  };

  // Verify a user's age
  public shared ({ caller }) func verifyAge(username : Text, verifiedAge : Nat) : async Bool {
    switch (userProfilesMap.get(username)) {
      case (null) { false };
      case (?userProfile) {
        let updatedProfile = {
          username = userProfile.username;
          passwordHash = userProfile.passwordHash;
          dob = userProfile.dob;
          displayName = userProfile.displayName;
          ageVerified = true;
          verifiedAge = ?verifiedAge;
          parentalControls = userProfile.parentalControls;
          cameraVerification = userProfile.cameraVerification;
        };
        userProfilesMap.add(username, updatedProfile);
        true;
      };
    };
  };

  // Remove a user by username
  public shared ({ caller }) func removeUser(username : Text) : async Bool {
    switch (userProfilesMap.get(username)) {
      case (null) { false };
      case (?userProfile) {
        if (adminUsernames.contains(username)) {
          adminUsernames.remove(username);
        };
        userProfilesMap.remove(username);
        true;
      };
    };
  };

  // Update a user's password
  public shared ({ caller }) func updatePassword(username : Text, oldPasswordHash : Text, newPasswordHash : Text) : async Bool {
    switch (userProfilesMap.get(username)) {
      case (null) { false };
      case (?userProfile) {
        if (userProfile.passwordHash == oldPasswordHash) {
          let updatedProfile = {
            username = userProfile.username;
            passwordHash = newPasswordHash;
            dob = userProfile.dob;
            displayName = userProfile.displayName;
            ageVerified = userProfile.ageVerified;
            verifiedAge = userProfile.verifiedAge;
            parentalControls = userProfile.parentalControls;
            cameraVerification = userProfile.cameraVerification;
          };
          userProfilesMap.add(username, updatedProfile);
          true;
        } else { false };
      };
    };
  };

  // Get all users (sorted array using custom compare function)
  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    userProfilesMap.values().toArray().sort();
  };

  // Count number of users
  public query ({ caller }) func countUsers() : async Nat {
    userProfilesMap.values().toArray().size();
  };
};
