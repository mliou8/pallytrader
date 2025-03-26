import { usePrivy } from "@privy-io/react-auth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { ready, authenticated } = usePrivy();

  if (!ready) return <div>Loading...</div>;

  return authenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;

