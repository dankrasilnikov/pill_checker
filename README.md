# MedsRecognition: Medication Intersection Project

Welcome to MedsRecognition – a project born out of my love for coding and healthcare. This is my playground for learning new tech, experimenting with AI, and solving real-world challenges.

## Project Overview

MedsRecognition is designed to simplify the process of managing medication interactions. Instead of rummaging through instructions or searching online, this project aims to provide a straightforward solution.

## Idea & Purpose

The concept behind MedsRecognition is straightforward. Imagine you need a painkiller but are already taking other medications. MedsRecognition helps ensure safety by managing and checking medication interactions.

## Tech Stack & Tools

- **Language:** Python
- **Web Frameworks:**
  - [Django](https://www.djangoproject.com)
  - [Flask](https://flask.palletsprojects.com)
  - [FastAPI](https://fastapi.tiangolo.com)
- **Containerization:** [Docker](https://www.docker.com)
- **Cloud Hosting:** Started with AWS, then switched to [DigitalOcean](https://www.digitalocean.com) for cost-effectiveness.
- **Database & Auth:** Using [Supabase](https://supabase.com) for a real-time database and user authentication.
- **AI & NLP:** Leveraging large language models along with pipelines for image text extraction using the [en_ner_bc5cdr_md model from SciSpacy](https://github.com/allenai/scispacy) paired with the [RxNorm linker](https://www.nlm.nih.gov/research/umls/rxnorm/index.html).

## Frontend UI

The user interface is a vital part of MedsRecognition. The UI project is maintained in a separate folder: [MedsRecognition-Frontend](https://github.com/SPerekrestova/MedsRecognition-Frontend). This sleek, user-friendly interface is crafted by [Dan K.](https://github.com/dankrasilnikov).

## Challenges & Learnings

Building MedsRecognition was a journey full of learning and experimentation. Here are some hurdles I overcame:
- Switching between different Python frameworks to build a full-featured web app and API.
- Integrating image processing and text extraction to reliably scan medicine packs.
- Optimizing performance while managing the heavy memory needs of large language models.
- Experimenting with cloud deployment and containerization.
- Implementing a real-time database and authentication system using Supabase.

## Future Enhancements

There’s plenty more on the horizon! Here’s what I’m planning next:
- **Interaction Analysis:** Real-time checks for drug interactions with detailed trademark resolution.
- **Resource Optimization:** Fine-tuning deployment to handle memory and processing demands better.
- **Feature Expansion:** Adding personalized medication recommendations and smarter alerts.
- **Advanced AI Techniques:** Exploring improved OCR and NLP methods.

## Links & References

Check out the project folders and learn more about the tools I used:
- [MedsRecognition](https://github.com/SPerekrestova/MedsRecognition/tree/master/MedsRecognition)
- [BiomedNER](https://github.com/SPerekrestova/MedsRecognition/tree/master/BiomedNER)
- [UI Repository](https://github.com/SPerekrestova/MedsRecognition-Frontend)

Other useful resources:
- [SciSpacy (en_ner_bc5cdr_md model)](https://github.com/allenai/scispacy)
- [RxNorm Linker](https://www.nlm.nih.gov/research/umls/rxnorm/index.html)
- [World Health Organization](https://www.who.int)

## Conclusion

MedsRecognition reflects my passion for healthcare and tech. It’s a hands-on example of how quickly you can learn a new tech stack and build something that truly makes a difference. 

&copy; 2025 Svetlana Perekrestova. All Rights Reserved.
