# OQMS - Online Queue Management System

## 🚀 Présentation

**OQMS** est un système ultra simplifié de gestion de files d’attente pour agences.  
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

## 📈 Schéma de l'architecture

+-----------+ +-----------+ +-----------+ | UI Client| ----> | Gateway | -----> | Ticket Svc| +-----------+ +-----------+ +-----------+ | v +-----------+ | Queue Svc | +-----------+ | +----------------------+ | +-----------+ | RabbitMQ | +-----------+

Agent side:

+-----------+ +-----------+ | UI Agent | ----> | Gateway | +-----------+ +-----------+


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
