
const CheckOrder = () => {
    return (
        <>
            <div className="pl-5 bg-[#fff] shadow w-[70%] p-5">
                <h1 className="font-bold">Quản lý đơn hàng</h1>
                <div>
                    <div className="flex gap-4 items-center justify-between border-b-2 border-slate-200 pb-2">
                        <div className="flex gap-4">
                            <span className={`text-rose-500`}>Chờ xác nhận</span>
                            <span>Đã xác nhận</span>
                            <span>Đang vận chuyển</span>
                            <span>Đẫ giao hàng</span>
                            <span>Đã hủy</span>
                        </div>
                        <div>
                            <select name="" id="" className="w-[200px] border-2 border-slate-200 p-2 rounded-[10px]">
                                 <option value="">Tất cả</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckOrder;
