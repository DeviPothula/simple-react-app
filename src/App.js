import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Simple react without nginx as web server to host instead using eks</h1>
      <h2>Using Kubernetes as container orchestration </h2>
      <h3>Amazon EKS :</h3>
      <p>Deployed successfully </p>
      <p>New change to test deployment 2 !!!</p>
      <p style={{ color: 'red' }}>New change to test deployment 3 !!! please work</p>
      <p style={{ color: 'green' }}>Rollout command added to restart the server after every build....</p>
      <p>Test github hook commit..</p>
      <p>Send email on build... ---</p>
    </div>
  );
}

export default App;
