const frases = [
  'carne moída na hora',
  'desde 1998',
  'pão brioche da casa',
  'chapa de ferro fundido',
  'zero congelado',
  'molhos próprios',
]

export function Marquee() {
  const linha = [...frases, ...frases]

  return (
    <div className="relative w-full overflow-hidden border-y border-line bg-coal py-4 select-none">
      <div className="marquee-track">
        {[0, 1].map((bloco) => (
          <div key={bloco} className="flex shrink-0 items-center" aria-hidden={bloco === 1}>
            {linha.map((f, i) => (
              <span key={`${bloco}-${i}`} className="flex items-center">
                <span className="display px-6 text-xl text-bone/70 sm:text-2xl">{f}</span>
                <span className="h-1.5 w-1.5 rotate-45 bg-ember" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-coal to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-coal to-transparent" />
    </div>
  )
}
