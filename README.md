# 🗳️ Bureau des Votes Décentralisé

Une application décentralisée (DApp) full-stack qui permet à n'importe qui de créer et de participer à des sessions de vote transparentes sur la blockchain Ethereum.

### [➡️ Accéder à la Démo Live]()

![Aperçu de la DApp]

## 📋 Comment Utiliser l'Application

Pour interagir avec cette application sur le réseau de test **Sepolia**, vous aurez besoin de trois choses :

#### 1. Un Portefeuille Navigateur
Un portefeuille vous permet d'interagir avec les applications blockchain. **MetaMask** est le plus populaire.
* **Action :** [Installez l'extension MetaMask](https://metamask.io/) pour votre navigateur.

#### 2. Se Connecter au Réseau Sepolia
Cette application est déployée sur Sepolia, un réseau de test d'Ethereum.
* **Action :** Dans MetaMask, cliquez sur le sélecteur de réseau en haut à gauche et assurez-vous que l'option "Afficher les réseaux de test" est activée dans les paramètres. Ensuite, sélectionnez **"Sepolia"** dans la liste.



#### 3. Obtenir des Sepolia ETH (gratuitement)
Les transactions sur la blockchain (même sur un réseau de test) nécessitent du "gaz", qui est payé avec la cryptomonnaie native du réseau. Pour Sepolia, c'est le Sepolia ETH. Vous pouvez en obtenir gratuitement via un "faucet" (un robinet).
* **Action :** Rendez-vous sur un faucet comme [sepoliafaucet.com](https://sepoliafaucet.com/). Copiez l'adresse de votre portefeuille depuis MetaMask, collez-la sur le site du faucet, et demandez des fonds. Vous recevrez des Sepolia ETH en quelques minutes.

Une fois votre portefeuille configuré et financé, vous êtes prêt à utiliser l'application !

## ✨ Fonctionnalités

* **Factory de Votes :** N'importe qui peut lancer une nouvelle session de vote avec un nom, une description et une durée personnalisés.
* **Participation Ouverte :** Les utilisateurs peuvent s'inscrire comme participants à un vote en cours.
* **Vote On-Chain :** Système de vote sécurisé (un portefeuille = un vote par session).
* **Mises à Jour en Temps Réel :** L'interface se met à jour instantanément pour tous les utilisateurs grâce à l'écoute des événements du smart contract.
* **Pagination :** La page d'accueil charge les votes de manière progressive ("Charger plus") pour une performance optimale.
* **Identité Web3 :** Affichage des noms ENS et des avatars Blockies pour une meilleure identification des adresses.
* **Interface Moderne :** Design soigné et responsive (Next.js & Tailwind CSS) avec thème sombre, modaux, et notifications.

## 🛠️ Stack Technique

* **Frontend :** Next.js, React, TypeScript, ethers.js, Tailwind CSS, Web3Modal
* **Backend :** Solidity, Hardhat
* **Blockchain :** Sepolia Ethereum Testnet

## 📂 Structure du Monorepo

Ce dépôt contient l'ensemble du projet, divisé en deux packages principaux :

* `/backend` : Contient les smart contracts Solidity.
* `/frontend` : Contient l'application web Next.js.