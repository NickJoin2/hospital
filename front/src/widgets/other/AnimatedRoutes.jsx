import { useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <TransitionGroup>
            <CSSTransition key={location.key} classNames="page" timeout={300}>
                <Routes location={location}>
                    {/* Все ваши Route */}
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
};