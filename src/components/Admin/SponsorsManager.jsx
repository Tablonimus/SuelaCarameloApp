import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../redux/actions/index";
import axios from "axios";

const defaultSponsorInput = {
  name: "",
  logo: "",
  website: "",
  instagram: "",
  ubicacion: "",
};

const defaultCouponInput = {
  name: "",
  logo: "",
  terminos: "",
  descuento: "",
  telefono: "",
  ubicacion: "",
};

export default function SponsorsManager() {
  const dispatch = useDispatch();
  const { sponsors, coupons } = useSelector((state) => state);

  // Loading states
  const [loadingSponsorLogo, setLoadingSponsorLogo] = useState(false);
  const [loadingCouponLogo, setLoadingCouponLogo] = useState(false);
  const [loadingSponsorAction, setLoadingSponsorAction] = useState(false);
  const [loadingCouponAction, setLoadingCouponAction] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [sponsorInput, setSponsorInput] = useState(defaultSponsorInput);
  const [couponInput, setCouponInput] = useState(defaultCouponInput);

  // Edit states - stores the ID being edited
  const [editingSponsorId, setEditingSponsorId] = useState(null);
  const [editingCouponId, setEditingCouponId] = useState(null);

  // Form data for editing
  const [editingSponsorData, setEditingSponsorData] = useState(null);
  const [editingCouponData, setEditingCouponData] = useState(null);

  // Initial data load
  useEffect(() => {
    Promise.all([
      dispatch(getAllSponsors()),
      dispatch(getAllCoupons())
    ]).finally(() => {
      setLoadingInitial(false);
    });
  }, [dispatch]);

  // Image upload handler for Cloudinary
  const handleImageUpload = useCallback(async (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "suelApp");
    data.append("folder", "suelApp/sponsors");

    try {
      if (type === "sponsor") {
        setLoadingSponsorLogo(true);
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/tablonimus/image/upload",
          data
        );
        
        if (editingSponsorId) {
          setEditingSponsorData((prev) => ({
            ...prev,
            logo: res.data.secure_url,
          }));
        } else {
          setSponsorInput((prev) => ({
            ...prev,
            logo: res.data.secure_url,
          }));
        }
      } else {
        setLoadingCouponLogo(true);
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/tablonimus/image/upload",
          data
        );
        
        if (editingCouponId) {
          setEditingCouponData((prev) => ({
            ...prev,
            logo: res.data.secure_url,
          }));
        } else {
          setCouponInput((prev) => ({
            ...prev,
            logo: res.data.secure_url,
          }));
        }
      }
    } catch (error) {
      console.log("Error uploading image:", error);
      alert("Error al subir la imagen");
    } finally {
      if (type === "sponsor") {
        setLoadingSponsorLogo(false);
      } else {
        setLoadingCouponLogo(false);
      }
    }
  }, [editingSponsorId, editingCouponId]);

  // ===== SPONSOR HANDLERS =====
  function handleSponsorChange(e) {
    const { name, value } = e.target;
    if (editingSponsorId) {
      setEditingSponsorData((prev) => ({ ...prev, [name]: value }));
    } else {
      setSponsorInput((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleSponsorSubmit(e) {
    e.preventDefault();
    
    if (editingSponsorId && editingSponsorData) {
      // Update existing sponsor
      if (editingSponsorData.name && editingSponsorData.logo) {
        setLoadingSponsorAction(true);
        dispatch(updateSponsor(editingSponsorData)).then(() => {
          dispatch(getAllSponsors()).finally(() => {
            setLoadingSponsorAction(false);
            setEditingSponsorId(null);
            setEditingSponsorData(null);
          });
        });
      } else {
        alert("El nombre y el logo son obligatorios");
      }
    } else {
      // Create new sponsor
      if (sponsorInput.name && sponsorInput.logo) {
        setLoadingSponsorAction(true);
        dispatch(createSponsor(sponsorInput)).then(() => {
          dispatch(getAllSponsors()).finally(() => {
            setLoadingSponsorAction(false);
            setSponsorInput(defaultSponsorInput);
          });
        });
      } else {
        alert("El nombre y el logo son obligatorios");
      }
    }
  }

  function handleEditSponsor(item) {
    const id = getItemId(item);
    if (!id) {
      console.error("No se pudo obtener el ID del sponsor:", item);
      alert("Error: No se pudo obtener el ID del sponsor");
      return;
    }
    setEditingSponsorId(id);
    setEditingSponsorData({ ...item });
    setSponsorInput(defaultSponsorInput);
  }

  function handleCancelEditSponsor() {
    setEditingSponsorId(null);
    setEditingSponsorData(null);
  }

  // Helper function to get the ID from an item (handles both id and _id)
  const getItemId = (item) => item.id || item._id || item._doc?.id || item._doc?._id;

  function handleDeleteSponsor(item) {
    const id = getItemId(item);
    if (!id) {
      console.error("No se pudo obtener el ID del sponsor:", item);
      alert("Error: No se pudo obtener el ID del sponsor");
      return;
    }
    if (window.confirm("¿Estás seguro de eliminar este sponsor?")) {
      setLoadingSponsorAction(true);
      dispatch(deleteSponsor(id)).then(() => {
        dispatch(getAllSponsors()).finally(() => {
          setLoadingSponsorAction(false);
        });
      });
    }
  }

  // ===== COUPON HANDLERS =====
  function handleCouponChange(e) {
    const { name, value } = e.target;
    if (editingCouponId) {
      setEditingCouponData((prev) => ({ ...prev, [name]: value }));
    } else {
      setCouponInput((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleCouponSubmit(e) {
    e.preventDefault();
    
    if (editingCouponId && editingCouponData) {
      // Update existing coupon
      if (editingCouponData.name && editingCouponData.logo && editingCouponData.descuento) {
        setLoadingCouponAction(true);
        dispatch(updateCoupon(editingCouponData)).then(() => {
          dispatch(getAllCoupons()).finally(() => {
            setLoadingCouponAction(false);
            setEditingCouponId(null);
            setEditingCouponData(null);
          });
        });
      } else {
        alert("El nombre, logo y descuento son obligatorios");
      }
    } else {
      // Create new coupon
      if (couponInput.name && couponInput.logo && couponInput.descuento) {
        setLoadingCouponAction(true);
        dispatch(createCoupon(couponInput)).then(() => {
          dispatch(getAllCoupons()).finally(() => {
            setLoadingCouponAction(false);
            setCouponInput(defaultCouponInput);
          });
        });
      } else {
        alert("El nombre, logo y descuento son obligatorios");
      }
    }
  }

  function handleEditCoupon(item) {
    const id = getItemId(item);
    if (!id) {
      console.error("No se pudo obtener el ID del cupón:", item);
      alert("Error: No se pudo obtener el ID del cupón");
      return;
    }
    setEditingCouponId(id);
    setEditingCouponData({ ...item });
    setCouponInput(defaultCouponInput);
  }

  function handleCancelEditCoupon() {
    setEditingCouponId(null);
    setEditingCouponData(null);
  }

  function handleDeleteCoupon(item) {
    const id = getItemId(item);
    if (!id) {
      console.error("No se pudo obtener el ID del cupón:", item);
      alert("Error: No se pudo obtener el ID del cupón");
      return;
    }
    if (window.confirm("¿Estás seguro de eliminar este cupón?")) {
      setLoadingCouponAction(true);
      dispatch(deleteCoupon(id)).then(() => {
        dispatch(getAllCoupons()).finally(() => {
          setLoadingCouponAction(false);
        });
      });
    }
  }

  // Get current form data (edit or create)
  const currentSponsorData = editingSponsorId ? editingSponsorData : sponsorInput;
  const currentCouponData = editingCouponId ? editingCouponData : couponInput;
  const isEditingSponsor = editingSponsorId !== null;
  const isEditingCoupon = editingCouponId !== null;

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
    </div>
  );

  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center w-full gap-8 p-4">
      {/* SPONSORS FORM */}
      <div className="w-full bg-gray-700 rounded-lg p-4">
        <h2 className="text-2xl text-white font-bold mb-4 text-center">
          {isEditingSponsor ? "Editar Sponsor" : "Crear Sponsor"}
        </h2>
        <form onSubmit={handleSponsorSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label className="text-white font-semibold">Nombre *</label>
            <input
              className="rounded-lg p-2 text-black"
              type="text"
              name="name"
              placeholder="Nombre del sponsor..."
              value={currentSponsorData?.name || ""}
              onChange={handleSponsorChange}
              disabled={loadingSponsorAction}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold">Logo *</label>
            <input
              type="file"
              accept=".jpg, .png, .jpeg, .webp"
              onChange={(e) => handleImageUpload(e, "sponsor")}
              className="rounded-lg p-2 bg-amber-600 text-white"
              disabled={loadingSponsorAction}
            />
            {loadingSponsorLogo ? (
              <div className="flex items-center gap-2 mt-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                <span className="text-orange-400">Subiendo imagen...</span>
              </div>
            ) : currentSponsorData?.logo ? (
              <div className="relative mt-2">
                <img
                  src={currentSponsorData.logo}
                  alt="Sponsor logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
            ) : null}
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold">Website</label>
            <input
              className="rounded-lg p-2 text-black"
              type="text"
              name="website"
              placeholder="https://..."
              value={currentSponsorData?.website || ""}
              onChange={handleSponsorChange}
              disabled={loadingSponsorAction}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold">Instagram</label>
            <input
              className="rounded-lg p-2 text-black"
              type="text"
              name="instagram"
              placeholder="https://instagram.com/..."
              value={currentSponsorData?.instagram || ""}
              onChange={handleSponsorChange}
              disabled={loadingSponsorAction}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold">Ubicación</label>
            <input
              className="rounded-lg p-2 text-black"
              type="text"
              name="ubicacion"
              placeholder="Dirección o ubicación..."
              value={currentSponsorData?.ubicacion || ""}
              onChange={handleSponsorChange}
              disabled={loadingSponsorAction}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loadingSponsorAction}
              className={`${
                loadingSponsorAction
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white font-bold rounded-lg p-3 mt-2 flex-1 flex items-center justify-center`}
            >
              {loadingSponsorAction ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isEditingSponsor ? "Guardando..." : "Creando..."}
                </>
              ) : (
                isEditingSponsor ? "Guardar Cambios" : "Crear Sponsor"
              )}
            </button>
            {isEditingSponsor && (
              <button
                type="button"
                onClick={handleCancelEditSponsor}
                disabled={loadingSponsorAction}
                className="bg-gray-500 text-white font-bold rounded-lg p-3 mt-2 hover:bg-gray-600 flex-1"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* SPONSORS LIST */}
        <div className="mt-6">
          <h3 className="text-xl text-white font-bold mb-2">Sponsors Existentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sponsors && sponsors.length > 0 ? (
              sponsors.map((sponsor) => (
                <div
                  key={getItemId(sponsor)}
                  className="bg-gray-800 p-2 rounded flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {sponsor.logo && (
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <span className="text-white text-sm">{sponsor.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditSponsor(sponsor)}
                      disabled={loadingSponsorAction}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-gray-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteSponsor(sponsor)}
                      disabled={loadingSponsorAction}
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 disabled:bg-gray-500"
                    >
                      X
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white">No hay sponsors</p>
            )}
          </div>
        </div>
      </div>

      {/* COUPONS FORM */}
      <div className="w-full bg-gray-700 rounded-lg p-4">
        <h2 className="text-2xl text-white font-bold mb-4 text-center">
          {isEditingCoupon ? "Editar Cupón" : "Crear Cupón de Descuento"}
        </h2>
        <form onSubmit={handleCouponSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label className="text-white font-semibold">Nombre del negocio *</label>
            <input
              className="rounded-lg p-2 text-black"
              type="text"
              name="name"
              placeholder="Nombre del negocio..."
              value={currentCouponData?.name || ""}
              onChange={handleCouponChange}
              disabled={loadingCouponAction}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold">Logo *</label>
            <input
              type="file"
              accept=".jpg, .png, .jpeg, .webp"
              onChange={(e) => handleImageUpload(e, "coupon")}
              className="rounded-lg p-2 bg-amber-600 text-white"
              disabled={loadingCouponAction}
            />
            {loadingCouponLogo ? (
              <div className="flex items-center gap-2 mt-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                <span className="text-orange-400">Subiendo imagen...</span>
              </div>
            ) : currentCouponData?.logo ? (
              <div className="relative mt-2">
                <img
                  src={currentCouponData.logo}
                  alt="Coupon logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
            ) : null}
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold">Descuento (%) *</label>
            <input
              className="rounded-lg p-2 text-black"
              type="number"
              name="descuento"
              placeholder="25"
              value={currentCouponData?.descuento || ""}
              onChange={handleCouponChange}
              disabled={loadingCouponAction}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold">Términos y condiciones</label>
            <textarea
              className="rounded-lg p-2 text-black"
              name="terminos"
              placeholder="Descripción del descuento..."
              value={currentCouponData?.terminos || ""}
              onChange={handleCouponChange}
              rows={3}
              disabled={loadingCouponAction}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold">Teléfono</label>
            <input
              className="rounded-lg p-2 text-black"
              type="text"
              name="telefono"
              placeholder="2616 59-0000"
              value={currentCouponData?.telefono || ""}
              onChange={handleCouponChange}
              disabled={loadingCouponAction}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold">Ubicación</label>
            <input
              className="rounded-lg p-2 text-black"
              type="text"
              name="ubicacion"
              placeholder="Dirección del negocio..."
              value={currentCouponData?.ubicacion || ""}
              onChange={handleCouponChange}
              disabled={loadingCouponAction}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loadingCouponAction}
              className={`${
                loadingCouponAction
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white font-bold rounded-lg p-3 mt-2 flex-1 flex items-center justify-center`}
            >
              {loadingCouponAction ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isEditingCoupon ? "Guardando..." : "Creando..."}
                </>
              ) : (
                isEditingCoupon ? "Guardar Cambios" : "Crear Cupón"
              )}
            </button>
            {isEditingCoupon && (
              <button
                type="button"
                onClick={handleCancelEditCoupon}
                disabled={loadingCouponAction}
                className="bg-gray-500 text-white font-bold rounded-lg p-3 mt-2 hover:bg-gray-600 flex-1"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* COUPONS LIST */}
        <div className="mt-6">
          <h3 className="text-xl text-white font-bold mb-2">Cupones Existentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {coupons && coupons.length > 0 ? (
              coupons.map((coupon) => (
                <div
                  key={getItemId(coupon)}
                  className="bg-gray-800 p-2 rounded flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {coupon.logo && (
                      <img
                        src={coupon.logo}
                        alt={coupon.name}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-white text-sm">{coupon.name}</span>
                      <span className="text-orange-500 text-sm font-bold">
                        {coupon.descuento}% OFF
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditCoupon(coupon)}
                      disabled={loadingCouponAction}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-gray-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon)}
                      disabled={loadingCouponAction}
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 disabled:bg-gray-500"
                    >
                      X
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white">No hay cupones</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
