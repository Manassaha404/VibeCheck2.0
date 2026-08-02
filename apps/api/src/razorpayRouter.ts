import express from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { env } from "./env";
import SubscriptionService from "@repo/services/razorpay";
const subscriptionService = new SubscriptionService();
const razorPayWebhookRouter = express.Router();
razorPayWebhookRouter.post(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const signature = req.headers["x-razorpay-signature"] as string | undefined;
    if (!signature) {
      return res.status(400).json({ error: "Missing signature header" });
    }
    const expected = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex");
    if (signature !== expected) {
      return res.status(400).json({ error: "Invalid signature" });
    }
    const event = JSON.parse(req.body.toString());
    const eventId =
      (req.headers["x-razorpay-event-id"] as string) ??
      event?.payload?.subscription?.entity?.id +
        "_" +
        event.event +
        "_" +
        event.created_at;
    const alreadyProcessed =
      await subscriptionService.checkWebHookAlreadyProcessed(eventId);
    if (alreadyProcessed) {
      return res.json({ status: "already_processed" });
    }
    const sub = event.payload?.subscription?.entity;
    try {
      await subscriptionService.handleSubscriptionEvent(event.event, sub);
      await subscriptionService.insertWebhookEvents(eventId, event.event);
      res.json({ status: "ok" });
    } catch (err) {
      console.error("Webhook processing error:", err);
      res.status(500).json({ error: "Processing failed" });
    }
  },
);

export default razorPayWebhookRouter;
