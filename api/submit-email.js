import 'dotenv/config';
import fs from "fs";
import path from "path";
import SibApiV3Sdk from "sib-api-v3-sdk";

const filePath = path.resolve("./emails.json");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      // Charger les emails existants
      let emails = [];
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        emails = JSON.parse(data);
      }

      // Ajouter l'email
      emails.push({ email, date: new Date().toISOString() });
      fs.writeFileSync(filePath, JSON.stringify(emails, null, 2));

      // Envoyer un email via Brevo
      const defaultClient = SibApiV3Sdk.ApiClient.instance;
      const apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = process.env.BREVO_API_KEY;

      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      const sendSmtpEmail = {
        to: [{ email }],
        sender: { name: "Decliq", email: "contact@decliq.fr" },
        subject: "Bienvenue sur Decliq !",
        htmlContent: `<p>Merci de vous être inscrit à Decliq. Restez à l'écoute pour notre lancement !</p>`,
      };

      await apiInstance.sendTransacEmail(sendSmtpEmail);

      console.log(`Nouvel email enregistré et message envoyé à : ${email}`);

      // Réponse de succès
      return res.status(200).json({ message: "Merci pour votre inscription !" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  } else {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }
}
