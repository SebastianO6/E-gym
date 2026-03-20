import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import { updateMember } from "../../../services/gymAdminService";
import styles from "./EditMemberModal.module.css";

const EditMemberModal = ({ member, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!member) return;

    setForm({
      name: member.full_name || `${member.first_name || ""} ${member.last_name || ""}`.trim(),
      phone: member.phone || "",
    });
  }, [member]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    if (!member?.id || saving) return;

    setSaving(true);
    try {
      await updateMember(member.id, {
        name: form.name.trim(),
        phone: form.phone.trim(),
      });
      window.alert("Member details updated successfully.");
      await onSaved?.();
      onClose();
    } catch (error) {
      window.alert(error.response?.data?.error || "Failed to update member details.");
    } finally {
      setSaving(false);
    }
  };

  if (!member) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Member</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone</label>
            <input
              className={styles.input}
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={save} className={styles.saveBtn} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMemberModal;
