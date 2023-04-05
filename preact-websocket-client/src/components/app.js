import { h, Component } from 'preact';

class App extends Component {
  constructor() {
    super();
    this.state = {
      output: '',
    };
  }

  componentDidMount() {
    this.connectWebSocket();
  }

  connectWebSocket() {
    const socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = event => {
      this.setState(prevState => ({ output: prevState.output + event.data }));
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
      setTimeout(() => {
        this.connectWebSocket();
      }, 1000);
    };

    socket.onerror = error => {
      console.error('WebSocket error: ', error);
    };
  }

  render(_, { output }) {
    return (
      <div>
        <h1>Console Output</h1>
        <pre>{output}</pre>
      </div>
    );
  }
}

export default App;
