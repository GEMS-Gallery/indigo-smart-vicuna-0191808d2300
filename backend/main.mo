import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Time "mo:base/Time";
import List "mo:base/List";
import Result "mo:base/Result";

actor {
  // Define the Post type
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Time.Time;
  };

  // Stable variable to store posts
  stable var posts : List.List<Post> = List.nil();
  stable var nextId : Nat = 0;

  // Add a new post
  public func addPost(title: Text, body: Text, author: Text) : async Result.Result<Nat, Text> {
    let post : Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := List.push(post, posts);
    nextId += 1;
    #ok(post.id)
  };

  // Get all posts in reverse chronological order
  public query func getPosts() : async [Post] {
    List.toArray(posts)
  };

  // System functions for upgrades
  system func preupgrade() {
    // No need to do anything as we're using a stable variable
  };

  system func postupgrade() {
    // No need to do anything as we're using a stable variable
  };
}
