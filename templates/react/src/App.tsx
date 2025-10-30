import React, { useState } from 'react';
import { FhevmProvider } from './components/FhevmProvider';
import EncryptionDemo from './components/EncryptionDemo';
import './App.css';

/**
 * Main React Application
 *
 * Demonstrates FHEVM SDK integration in a React app
 */
function App() {
  return (
    <FhevmProvider>
      <div className="app">
        <header>
          <h1>FHEVM React Template</h1>
          <p>Privacy-Preserving Applications with Fully Homomorphic Encryption</p>
        </header>

        <main>
          <EncryptionDemo />
        </main>

        <footer>
          <p>Built with @fhevm/sdk and React</p>
        </footer>
      </div>
    </FhevmProvider>
  );
}

export default App;
