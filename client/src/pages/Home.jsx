import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const BG_IMAGE = '/hero-bg.png';

export default function Home() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleCTA = () => {
    navigate(token ? '/create-trip' : '/signup');
  };

  return (
    <Layout bgClass="bg-brown">
      <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brown/60 via-brown/30 to-transparent" />

        <div className="relative z-10 flex flex-col justify-center min-h-screen px-12 md:px-20 max-w-2xl">
          <h2 className="font-sans font-medium text-5xl md:text-6xl leading-[56px] text-brown mb-6">
            Pack smart.
            <br />
            Travel light.
          </h2>
          <p className="text-beige/80 text-base md:text-lg font-light leading-[18px] mb-8 max-w-md">
            Custom travel packing lists based on your destination, dates, weather, and plans.
            <br />
            No more overpacking or forgetting the essentials.
          </p>
          <button
            onClick={handleCTA}
            className="self-start px-8 py-3 bg-brown text-beige rounded-full text-sm font-medium hover:bg-brown-dark transition-colors"
          >
            Generate My Packing List
          </button>
        </div>
      </div>
    </Layout>
  );
}
