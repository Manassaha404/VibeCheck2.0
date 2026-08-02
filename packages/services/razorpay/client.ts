import RazorPay from "razorpay";
import { env } from "../env";

const razorpayInstance = new RazorPay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export default razorpayInstance;
