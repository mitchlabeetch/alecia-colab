'use server';

import { createStreamableValue } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function generateOutlineAction(prompt: string, language = 'fr-FR') {
  const stream = createStreamableValue('');

  (async () => {
    const { textStream } = await streamText({
      model: openai('gpt-4-turbo'),
      system: language === 'fr-FR'
        ? `Tu es un expert en création de présentations professionnelles.
           Génère un plan de présentation structuré avec 5-8 diapositives.
           Utilise un ton professionnel adapté au contexte M&A et finance.

           FORMAT DE SORTIE OBLIGATOIRE (XML):
           <SLIDE>
             <TITLE>Titre de la diapositive</TITLE>
             <BULLET>Point clé 1</BULLET>
             <BULLET>Point clé 2</BULLET>
             <IMAGE>Description détaillée pour générer une image pertinente (en anglais)</IMAGE>
           </SLIDE>

           Assure-toi de fermer toutes les balises.`
        : `You are an expert presentation creator.
           Generate a structured presentation outline with 5-8 slides.
           Use a professional tone suitable for M&A and finance context.

           REQUIRED OUTPUT FORMAT (XML):
           <SLIDE>
             <TITLE>Slide Title</TITLE>
             <BULLET>Key point 1</BULLET>
             <BULLET>Key point 2</BULLET>
             <IMAGE>Detailed description for generating a relevant image (in English)</IMAGE>
           </SLIDE>

           Make sure to close all tags.`,
      prompt: prompt,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
