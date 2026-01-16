'use server';

import { createStreamableValue } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function generateOutlineAction(prompt: string) {
  const stream = createStreamableValue('');

  (async () => {
    try {
      const systemPrompt = `Tu es un expert en banque d'affaires et en stratégie, spécialisé dans la création de présentations M&A (Teasers, Mémorandums, Management Presentations).

      Ta mission est de générer un plan de présentation structuré, professionnel et percutant, basé sur la demande de l'utilisateur.
      Le ton doit être formel, précis et orienté business.

      Structure la présentation avec 5 à 8 diapositives logiques.

      IMPORTANT : Tu dois impérativement utiliser le format de balisage suivant pour que le système puisse lire ta réponse :

      <SLIDE>
        <TITLE>Titre de la diapositive (ex: Thèse d'investissement, Aperçu du Marché)</TITLE>
        <BULLET>Point clé 1 avec des données ou une affirmation forte</BULLET>
        <BULLET>Point clé 2</BULLET>
        <IMAGE>Description visuelle précise pour générer une image d'illustration professionnelle (ex: graphique de croissance, bureau moderne, équipe)</IMAGE>
      </SLIDE>

      Génère uniquement le contenu balisé, sans texte d'introduction ni de conclusion.`;

      const { textStream } = await streamText({
        model: openai('gpt-4-turbo'),
        system: systemPrompt,
        prompt: prompt,
        temperature: 0.7,
      });

      for await (const delta of textStream) {
        stream.update(delta);
      }

      stream.done();
    } catch (error) {
      console.error("Erreur lors de la génération de la présentation :", error);
      // We don't want to expose raw error objects to the stream in production usually,
      // but for debugging it helps. Let's send a friendly French message.
      stream.update("\n<SLIDE><TITLE>Erreur</TITLE><BULLET>Une erreur est survenue lors de la génération.</BULLET></SLIDE>");
      stream.done();
    }
  })();

  return { stream: stream.value };
}
