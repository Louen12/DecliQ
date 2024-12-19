import 'dotenv/config';
import { supabase } from './supabaseClient';
import SibApiV3Sdk from "sib-api-v3-sdk";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      // Ajouter l'email à la base de données Supabase
      const { data, error } = await supabase.from('mail').insert([{ mail: email }]);

      if (error) {
        console.error("Erreur lors de l'insertion dans la base de données :", error);
        return res.status(500).json({ message: "Erreur lors de l'enregistrement", 
          redirectUrl: "/thanks.html" 
         });
      }

      console.log("Email enregistré dans la base de données :", data);

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

      console.log(`Message envoyé à : ${email}`);

      // Réponse de succès
      return res.status(200).json({ 
        message: "Merci pour votre inscription !", 
        redirectUrl: "/thanks.html" 
      });
    } catch (error) {
      console.error("Erreur serveur :", error);
      return res.status(500).json({ message: "Erreur serveur" , 
        redirectUrl: "/thanks.html" });
    }
  } else {
    return res.status(405).json({ message: "Méthode non autorisée" , 
      redirectUrl: "/thanks.html" });
  }
}
