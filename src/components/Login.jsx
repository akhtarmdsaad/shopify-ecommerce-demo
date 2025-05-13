import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const handleLogin = () => {
    localStorage.setItem('user', 'testUser');
    navigate('/products');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Login as testUser
      </button>
    </div>
  );
}