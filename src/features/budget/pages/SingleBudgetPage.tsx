import { useParams } from 'react-router-dom';

export default function SingleBudgetPage() {
  const params = useParams();
  const { id } = params;

  return (
    <div>
      <h1>Single Budget Page</h1>
      <p>Budget ID: {id}</p>
    </div>
  );
}
