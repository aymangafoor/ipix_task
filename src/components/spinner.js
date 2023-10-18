export default function spinner({ size }) {
    console.log("spinner size is", size)
    return <div className="lds-ring" style={{ width: `${size}px`, height: `${size}px` }}>
        <div style={{ width: `${size - 5}px`, height: `${size - 5}px` }}></div>
        <div style={{ width: `${size - 5}px`, height: `${size - 5}px` }}></div>
        <div style={{ width: `${size - 5}px`, height: `${size - 5}px` }}></div>
        <div style={{ width: `${size - 5}px`, height: `${size - 5}px` }}></div>
    </div>
}