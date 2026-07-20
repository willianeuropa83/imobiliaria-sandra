import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Mapa | Imobiliária Sandra',
  description: 'Veja os imóveis disponíveis no mapa de Portugal.',
};

export default function MapaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white py-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-2">Mapa de Imóveis</h1>
            <p className="text-lg opacity-90">Explore imóveis por localização em Portugal</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Mapa interativo em breve</h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-6">
              Estamos a desenvolver um mapa interativo onde poderá explorar todos os imóveis
              por localização. Por agora, utilize os filtros na página de listagem para encontrar
              imóveis por distrito e concelho.
            </p>
            <a
              href="/imoveis"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Ver listagem de imóveis
            </a>
          </div>

          {/* Distritos */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Pesquise por distrito</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                'Aveiro', 'Beja', 'Braga', 'Bragança',
                'Castelo Branco', 'Coimbra', 'Évora', 'Faro',
                'Guarda', 'Leiria', 'Lisboa', 'Portalegre',
                'Porto', 'Santarém', 'Setúbal', 'Viana do Castelo',
                'Vila Real', 'Viseu',
              ].map((distrito) => (
                <a
                  key={distrito}
                  href={`/imoveis?distrito=${encodeURIComponent(distrito)}`}
                  className="bg-white border rounded-lg px-4 py-3 text-center text-gray-700 hover:border-purple-500 hover:text-purple-600 transition font-medium"
                >
                  {distrito}
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
