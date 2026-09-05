
import Rooms from '@/components/Rooms';
import PrivateRoute from '@/privateRoute/PrivateRoute';

const roomsPage = () => {
    return (
        <PrivateRoute><Rooms /></PrivateRoute>
    );
};

export default roomsPage;