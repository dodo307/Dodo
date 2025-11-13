import settingsIcon from './assets/settings.png';
import userIcon from './assets/user.png';

export default function NavIcons() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '1rem',
        backgroundColor: '#1f1f1f',
        padding: '10px 16px',
      }}
    >
      <img
        src={settingsIcon}
        alt="Settings"
        style={{ width: '24px', height: '24px', cursor: 'pointer' }}
      />
      <img src={userIcon} alt="User" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
    </div>
  );
}
