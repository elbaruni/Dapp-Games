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
    easy: { type: Number, decrypted: true },
    normal: { type: Number, decrypted: true },
    hard: { type: Number, decrypted: true }
  };
  static defaults = {
    easy: 0,
    normal: 0,
    hard: 0
  };
}
