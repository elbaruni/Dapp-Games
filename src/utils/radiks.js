import { Model } from "radiks";
export class Profile extends Model {
  static className = "Profile";
  static schema = {
    name: { type: String, decrypted: true },
    Blockstack_id: { type: String, decrypted: true },
    Gender: { type: String, decrypted: true }
  };
}
