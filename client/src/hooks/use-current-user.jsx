const { useState } = require("react");
const { useSelector, useDispatch } = require("react-redux");

const useCurrentUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleGetCurrentUser = async () => {
    if (user) return;
    try {
    } catch (error) {}
  };
};
