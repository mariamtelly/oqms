# OQMS - Online Queue Management System

## 🚀 Présentation

**OQMS** est un système simplifié de gestion de files d’attente pour agences.  
Il repose sur une architecture **microservices** orchestrée avec **Docker Compose**, avec une communication **RabbitMQ** pour la gestion des tickets.

Le projet se compose de :
- **Clients** : utilisent une interface web pour demander un ticket (UI Client)
- **Agents de guichet** : appellent les tickets via une interface dédiée (UI Agent)

## 🧩 Architecture

| Service            | Rôle |
|--------------------|------|
| **Gateway**         | Point d'entrée unique pour toutes les requêtes clients |
| **Ticket Service**  | Génère les tickets et calcule le temps d’attente estimé |
| **Queue Service**   | Stocke et récupère les tickets depuis RabbitMQ |
| **DB Service**      | Fournit les données statiques (services, guichets, etc.) |
| **RabbitMQ**        | Message broker utilisé pour la gestion des queues |
| **UI Client**       | Interface pour les clients finaux |
| **UI Agent**        | Interface pour les agents de guichets |


## 🛠️ Stack Technique

- **Node.js** (Express) pour les microservices
- **RabbitMQ** pour la gestion des files d'attente
- **Vite.js** pour les interfaces frontend
- **Docker Compose** pour l'orchestration des conteneurs

## 🛠️ Lancer le projet

### Prérequis
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé sur votre machine

### Instructions

1. **Clonez le projet** :
   ```bash
   git clone <URL_DU_REPO>
   cd oqms
2. **Construisez les images docker** :
   ```bash
   docker-compose build
4. **Démarrez les services** :
   ```bash
   docker-compose up
6. **Redémarrez queue-service si nécessaire** :
   ```bash
   docker-compose restart queue-service
8. **Accéder aux interfaces** :
- **UI Client** : [http://localhost:5174](http://localhost:5174)
- **UI Agent** : [http://localhost:5173](http://localhost:5173)
- **RabbitMQ Management** : [http://localhost:15672](http://localhost:15672)  
  *(Utilisateur : `guest`, Mot de passe : `guest`)*

---

## ⚙️ Points techniques importants

- **RabbitMQ** est utilisé pour créer dynamiquement des queues par service (`deposit`, `shipping`, `account_management`, etc.).
- **Les queues** sont créées automatiquement lors de la première demande d’un ticket.
- **Le temps d'attente** est calculé en fonction du nombre de clients en file et du temps de service moyen par guichet.
- **Les agents** récupèrent dynamiquement les tickets selon les files de service qu'ils peuvent prendre en charge.

---
