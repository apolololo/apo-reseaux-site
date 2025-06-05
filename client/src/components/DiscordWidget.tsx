const DiscordWidget = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <iframe
        src="https://discord.com/widget?id=931251896080011355&theme=dark"
        width="350"
        height="500"
        allowTransparency={true}
        frameBorder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        className="rounded-lg shadow-xl"
      />
    </div>
  );
};

export default DiscordWidget;