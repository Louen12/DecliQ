export default async function handler(req, res) {
    if (req.method === "POST") {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
  
      // Simule l'enregistrement de l'email (remplacez par une base de données ou un service comme Mailchimp/Brevo si besoin)
      console.log(`Nouvel email reçu : ${email}`);
  
      // Réponse de succès
      return res.status(200).json({ message: "Merci pour votre inscription !" });
    } else {
      return res.status(405).json({ message: "Méthode non autorisée" });
    }
  }
  