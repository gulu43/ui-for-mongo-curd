// project-imoports
// import AuthLoginForm from 'sections/auth/AuthLogin';
import Login from '../../../comp/Login.jsx';

// ===========================|| AUTH - LOGIN V1 ||=========================== //

function LoginPage() {
  return (
    <div className="auth-main">
      <div className="auth-wrapper v1">
        <div className="auth-form">
          <div className="position-relative">
            <div className="auth-bg">
              <span className="r"></span>
              <span className="r s"></span>
              <span className="r s"></span>
              <span className="r"></span>
            </div>
            <Login link="/register" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage
