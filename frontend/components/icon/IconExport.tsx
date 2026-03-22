// components/Icons/index.tsx

type IconProps = {
  className?: string;
  size?: number;
};

function Icon({ src, alt, className, size = 20 }: IconProps & { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      draggable={false}
      aria-hidden="true"
    />
  );
}

function IconDashboard(props: IconProps) {
  return <Icon src="/icon/IconDashboard.png" alt="Dashboard" {...props} />;
}
function IconData(props: IconProps) {
  return <Icon src="/icon/IconData.png" alt="Data" {...props} />;
}
function IconDevices(props: IconProps) {
  return <Icon src="/icon/IconDevices.png" alt="Devices" {...props} />;
}
function IconBottls(props: IconProps) {
  return <Icon src="/icon/IconBottles.png" alt="Bottles" {...props} />;
}
function IconTokens(props: IconProps) {
  return <Icon src="/icon/IconTokens.png" alt="Tokens" {...props} />;
}
function IconActivtyLog(props: IconProps) {
  return <Icon src="/icon/IconActivityLog.png" alt="Activity Log" {...props} />;
}
function IconSysteMonitoring(props: IconProps) {
  return <Icon src="/icon/IconSystemMonitoring.png" alt="System Monitoring" {...props} />;
}
function IconSettigs(props: IconProps) {
  return <Icon src="/icon/IconSettings.png" alt="Settings" {...props} />;
}
function IconMenu(props: IconProps) {
  return <Icon src="/icon/IconMenu.png" alt="Menu" {...props} />;
}
function IconClose(props: IconProps) {
  return <Icon src="/icon/IconClose.png" alt="Close" {...props} />;
}
function IconInfo(props: IconProps) {
  return <Icon src="/icon/IconInfo.png" alt="Info" {...props} />;
}

function IconLeader(props: IconProps) {
  return <Icon src="/icon/IconLeader.png" alt="Leader" {...props} />;
}
// ── Export ทั้งหมดใน object เดียว ─────────────────────────
export const Icons = {
  Dashboard:       IconDashboard,
  Data:            IconData,
  Devices:         IconDevices,
  Bottls:          IconBottls,
  Tokens:          IconTokens,
  ActivtyLog:      IconActivtyLog,
  SysteMonitoring: IconSysteMonitoring,
  Settigs:         IconSettigs,
  Menu:            IconMenu,
  Close:           IconClose,
  Info:            IconInfo,
  Leader:          IconLeader,
};