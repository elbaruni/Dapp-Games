import { Model } from "radiks";
export class Profile extends Model {
  static className = "Profile";
  static schema = {
    name: { type: String, decrypted: true },
    Blockstack_id: { type: String, decrypted: true },
    Gender: { type: String, decrypted: true }
  };
}
export class FlappyBird extends Model {
  static className = "FlappyBird";
  static schema = {
    Blockstack_id: { type: String, decrypted: true },
    Scores: { type: Array, decrypted: true }
  };
  static defaults = {
    Scores: [0, 0, 0]
  };
}
