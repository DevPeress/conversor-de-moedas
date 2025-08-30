import { useEffect, useState } from 'react'
import logo from './assets/logo.svg'

function App() {
  const [moedas, setMoedas] = useState<{ [key: string]: string }>({})
  const [selecionada, setSelecionada] = useState<string>("")
  const [valor, setValor] = useState<string>("")
  const [resultado, setResultado] = useState<string | null>(null)

  const converter = () => {
    if (!selecionada || !valor) return
    
    fetch(`https://api.currencylayer.com/live?access_key=1fd8edf46a62dd3687109c323a7a361a&currencies=BRL&source=${selecionada}`)
      .then((res) => res.json())
      .then((data) => {
        const quoteKey: string = selecionada + "BRL"
        const cotacao = data.quotes ? data.quotes[quoteKey] : null

        if (cotacao) {
          const valorNum: number = parseFloat(valor)
          const valorConvertido: number = valorNum * cotacao
          setResultado(valorConvertido.toFixed(2))
        } else {
          setResultado(null)
          console.error("Cotação não encontrada.")
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar cotação:", error)
      })
  }

  function formatNumero(value: string) {
    let numericValue = value.replace(/\D/g, "")

    numericValue = numericValue.replace(/^0+/, "") || "0"

    if (numericValue.length === 1) {
      setValor("0,0" + numericValue)
    } else if (numericValue.length === 2) {
      setValor("0," + numericValue)
    } else {
      const inteiros = numericValue.slice(0, -2).replace(/^0+/, "") || "0" 
      const decimais = numericValue.slice(-2)
      setValor(inteiros + "," + decimais)
    }
  }

  useEffect(() => {
    fetch("https://api.currencylayer.com/list?access_key=1fd8edf46a62dd3687109c323a7a361a")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.currencies) {
          setMoedas(data.currencies)
          const primeiraMoeda = Object.keys(data.currencies)[0]
          setSelecionada(primeiraMoeda)
        } 
      })
      .catch((error) => {
        console.error("Erro ao buscar moedas:", error)
      })
  }, [])

  return (
    <>
      <main className="flex absolute w-[100vw] h-[100vh] items-center justify-center overflow-hidden bg-[#04040B]">
        <img className='absolute top-[20vw] md:top-[10vw] lg:top-[5vw]' src={logo} alt="" />

        <div className='flex absolute top-[40vw] md:top-[20vw] lg:top-[12vw] w-[90vw] md:w-[40vw] lg:w-[25vw] h-[100vw] md:h-[35vw] lg:h-[20vw] rounded-[1.25vw] bg-[#141534] items-center justify-center'>

          <h1 className='absolute top-[5vw] md:top-[3vw] lg:top-[1vw] left-[3.3vw] text-[#B2B8DE] text-[5vw] md:text-[2vw] lg:text-[1vw]'>VALOR</h1>
          <input className='flex absolute top-[13.5vw] md:top-[6vw] lg:top-[3vw] w-[85vw] md:w-[33.3vw] lg:w-[18.333vw] h-[15vw] md:h-[5.14vw] lg:h-[2.708vw] p-[1vw] bg-[#0E0F25] rounded-[0.417vw] text-[#B2B8DE] text-[4vw] md:text-[2vw] lg:text-[1vw]' value={valor} onChange={(e) => { formatNumero(e.target.value); if (resultado) { setResultado(null) } }} type="text" placeholder='0,00' />

          <h1 className='absolute top-[30vw] md:top-[12vw] lg:top-[7vw] left-[3.3vw] text-[#B2B8DE] text-[5vw] md:text-[2vw] lg:text-[1vw]'>MOEDA</h1>
          <select value={selecionada} onChange={(e) => setSelecionada(e.target.value)} className="flex absolute top-[40vw] md:top-[15vw] lg:top-[9vw] w-[85vw] md:w-[33.3vw] lg:w-[18.333vw] h-[20vw] md:h-[7.14vw] lg:h-[3.708vw] p-[1vw] bg-[#0E0F25] rounded-[0.417vw] text-[#B2B8DE] text-[4vw] md:text-[2vw] lg:text-[1vw]" name="Tipos" id="tipos">
            {moedas && Object.entries(moedas).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>

          <button className='flex absolute top-[75vw] md:top-[25vw] lg:top-[14vw] w-[85vw] md:w-[33.3vw] lg:w-[18.333vw] h-[15vw] md:h-[5.14vw] lg:h-[2.708vw] p-[1vw] bg-[#2F34AB] rounded-[0.417vw] text-[#B2B8DE] items-center justify-center text-[4vw] md:text-[2vw] lg:text-[1vw]' onClick={converter}> Converter em reais</button>
        </div>

        <div className='flex absolute top-[138vw] md:top-[54vw] lg:top-[30vw] w-[90vw] md:w-[40vw] lg:w-[25vw] h-[32vw] md:h-[16vw] lg:h-[8.125vw] rounded-b-[1.25vw] bg-[#1F2151] items-center justify-center flex-col'>
          {resultado ? (
            <>
              <h1 className='text-[#7D8DEC]'>1 {selecionada} = R$ {(parseFloat(resultado) / parseFloat(valor || "1")).toFixed(2)}</h1>
              <h2 className='text-[6vw] md:text-[3vw] lg:text-[1.5vw] text-[#F1F2F6]'> {valor} {selecionada} = R${parseFloat(resultado).toFixed(2)}</h2>
            </>
          ) : (
            <h1 className='text-[#7D8DEC]'>Informe um valor e converta</h1>
          )}
        </div>
      </main>
    </>
  )
}

export default App