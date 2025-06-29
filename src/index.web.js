import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRegistry } from 'react-native';
import App from './App';

// 注册应用
AppRegistry.registerComponent('main', () => App);

// Web渲染
const container = document.getElementById('root');
const root = createRoot(container);

// 渲染应用
AppRegistry.runApplication('main', {
  rootTag: container,
});

export default App; 