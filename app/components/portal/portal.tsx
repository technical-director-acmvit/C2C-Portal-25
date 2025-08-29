

const Portal = () => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundImage: 'url(/portal/bg1.svg)',
               
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: 0,
            }}
        >
            {/* You can add overlay content here if needed */}
        </div>
    );
};
export default Portal;