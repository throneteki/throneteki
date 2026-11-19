import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/reducers/navigation';

const Redirect = ({ to }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(navigate(to, undefined, true));
    }, [dispatch, to]);

    return null;
};

export default Redirect;
