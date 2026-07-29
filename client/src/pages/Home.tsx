import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import PlanHolder from "../components/PlanHolder";
import { getData } from "../services/api";

function Dashboard() {
  
  interface Card {title: string, subtitle: string};
  
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(()=> {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const schedules = await getData('schedules');
        console.log(schedules);
        const modifiedCards: Card[] = schedules.map(schedule => ({
          title: schedule.name,
          subtitle: `${schedule.total_days} days/week ~ ${45} min`, //TODO change with real data
        }));
        
        setCards(modifiedCards);
      }
      catch (err) {
        setError(err.message);
      }
      finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);


  return (
    <>
      <Header></Header>
      <main> 
        <PlanHolder cards={cards}>Try our plans!</PlanHolder>
        {loading && <p className="text-loading">{'loading...'}</p>}
        {error && <p className="text-error">{error}</p>}
      </main>
    </>
  );
};

export default Dashboard;