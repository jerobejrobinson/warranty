export default function Input({ name, labelText, req, type, className, id, onChange} : {
    name: string;
    labelText: string;
    req: boolean;
    type: 'text' | 'password' | 'email' | 'date' | 'number';
    className?: string;
    id?: string;
    onChange?: any;
}) {
    return (
        <label htmlFor={name} className={`w-full ${className}`} id={id} >
            <span className="text-sm">{labelText}</span>
            <input 
                type={type} 
                name={name} 
                id={name} 
                className="p-2 block w-full border border-1 border-gray-300 rounded" 
                required={req} 
                onChange={onChange}
            />
        </label>
    )
}