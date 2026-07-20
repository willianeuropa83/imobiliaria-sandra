import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Sobre | Imobiliária Sandra',
  description: 'Conheça a Imobiliária Sandra — o seu agregador de imóveis em Portugal.',
};

export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Sobre a Imobiliária Sandra</h1>
            <p className="text-lg opacity-90">O seu parceiro na procura do imóvel ideal em Portugal</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
          {/* Quem somos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quem Somos</h2>
            <p className="text-gray-600 leading-relaxed">
              A Imobiliária Sandra é um agregador inteligente de imóveis que reúne, num só lugar,
              ofertas dos principais portais imobiliários de Portugal. O nosso objetivo é simplificar
              a sua pesquisa, poupando-lhe tempo e esforço ao comparar opções de múltiplas fontes.
            </p>
          </section>

          {/* Como funciona */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Como Funciona</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-semibold text-gray-800 mb-2">Recolha Diária</h3>
                <p className="text-gray-600 text-sm">
                  Monitorizamos diariamente os principais portais imobiliários de Portugal
                  para garantir que tem acesso às ofertas mais recentes.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-gray-800 mb-2">Filtros Inteligentes</h3>
                <p className="text-gray-600 text-sm">
                  Pesquise por localização, tipologia, preço, área e muito mais.
                  Encontre exatamente o que procura com os nossos filtros avançados.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-3xl mb-3">🏠</div>
                <h3 className="font-semibold text-gray-800 mb-2">Contacto Direto</h3>
                <p className="text-gray-600 text-sm">
                  Encontrou o imóvel ideal? Envie uma mensagem diretamente
                  através da nossa plataforma.
                </p>
              </div>
            </div>
          </section>

          {/* Portais */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Portais Monitorizados</h2>
            <div className="flex flex-wrap gap-3">
              {['Imovirtual', 'Supercasa', 'OLX', 'CustoJusto', 'RE/MAX', 'Century 21', 'ERA', 'CA Imóveis', 'Caixa Imobiliário'].map((portal) => (
                <span key={portal} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  {portal}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
