import Arrow from '../assets/icons/Arrow.svg';

function PlanHolder({children, cards}) {
  return (
    <div className="plans-holder">
        <h1 className="text-title">{children}</h1>
        <div className="plans">
          {cards.map((card, index) => (
            <div className="plan-box" key={index}>
                <div>
                  <h2 className="text-heading">{card.title}</h2>
                  <span className="text-subtitle">{card.subtitle}</span>
                </div>
                <img src={Arrow} width={40} height={40} />
            </div>
          ))}
        </div>      
    </div>
  )
}

export default PlanHolder;