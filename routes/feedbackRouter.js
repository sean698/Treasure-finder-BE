import { Router } from "express";
import { Resend } from "resend";

const feedbackRouter = Router();

const resend = new Resend(process.env.RESEND_API_KEY);

feedbackRouter.post("/", async (req, res) => {
  try {
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ error: "Feedback content is required" });
    }

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "shiyuanm000@gmail.com",
      subject: "Collectly Feedback",
      text: feedback,
    });

    res.json({ message: "Feedback sent successfully" });
  } catch (error) {
    console.error("Error sending feedback:", error);
    res.status(500).json({ error: error.message });
  }
});

export default feedbackRouter;
