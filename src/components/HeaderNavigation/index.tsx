import { ArrowLeft } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';
import Title from '../ui/title';

type HeaderNavigationProps = {
  title: string;
  icon?: React.ReactNode;
};

const HeaderNavigation = ({ title, icon }: HeaderNavigationProps) => {
  const navigate = useNavigate();

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  /*
  <div className="flex items-center mb-5">
        <Button variant="ghost" className="p-3 mr-3" onClick={handleGoBack}>
          <ArrowLeft className="size-5 mt-1" />
        </Button>
        <Title>Fluxo de caixa</Title>
      </div>
  
  */

  return (
    <div className="flex items-center mb-5">
      <Button variant="ghost" className="p-3 mr-3" onClick={handleGoBack}>
        {icon ? icon : <ArrowLeft className="size-5 mt-1" />}
      </Button>
      <Title>{title}</Title>
    </div>
  );
};

export default HeaderNavigation;
