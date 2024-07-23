import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';
import * as CryptoJS from 'crypto-js';

const cfg = {
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      inputText: '',
      inputKey: '',
      encryptedBase64Input: '',
      encryptedBase64: '',
      decryptKey: '',
      outputText: '', // Khởi tạo outputText trong state
    };
  }

  algorithm = 'aes-256-cbc';
  iv = CryptoJS.enc.Utf8.parse('hash_ww_core_iv'.padEnd(16, '0'));

  decrypt(text, keyInput) {
    try {
      const key = CryptoJS.enc.Utf8.parse(keyInput.padEnd(32, '0'));
      const encryptedText = CryptoJS.enc.Base64.parse(text);
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encryptedText },
        key,
        {
          iv: this.iv,
          ...cfg,
        }
      );
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return 'error';
    }
  }

  handleInputTextChange = (event) => {
    this.setState({
      inputText: event.target.value,
    });
  };

  handleInputKeyChange = (event) => {
    this.setState({
      inputKey: event.target.value,
    });
  };

  handleDecryptKeyChange = (event) => {
    this.setState({
      decryptKey: event.target.value,
    });
  };

  handleMsgChange = (event) => {
    this.setState({
      encryptedBase64: event.target.value,
    });
  };

  handleDecryptClick = () => {
    const { encryptedBase64, decryptKey } = this.state;
    if (encryptedBase64 && decryptKey) {
      const decryptedText = this.decrypt(encryptedBase64, decryptKey);
      this.setState({
        outputText: decryptedText,
      });
    } else {
      this.setState({
        outputText: 'N/A',
      });
    }
  };

  render() {
    const { outputText } = this.state;
    return (
      <>
        <h1>WW - Crypto decrypt AES</h1>
        <div className="form-group">
          <label>Encrypted String:</label>
          <input
            className="form-control"
            value={this.state.encryptedBase64}
            onChange={this.handleMsgChange}
            style={{ width: '40%', height: 40, marginRight: 20 }}
          />
          <label>Key:</label>
          <input
            className="form-control"
            value={this.state.decryptKey}
            onChange={this.handleDecryptKeyChange}
            style={{ width: '40%', height: 40 }}
          />
          <button onClick={this.handleDecryptClick} style={{ marginTop: 10 }}>
            Decrypt
          </button>
        </div>

        <pre className="output">
          <code>{outputText}</code>
        </pre>
      </>
    );
  }
}

render(<App />, document.getElementById('root'));