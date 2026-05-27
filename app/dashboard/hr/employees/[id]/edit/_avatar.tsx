"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Upload, Trash2 } from "lucide-react";
import { createClient } from "../../../../../_lib/supabase/client";
import { setEmployeePhoto } from "../../actions";

export function AvatarUpload({
  orgId,
  employeeId,
  initialUrl,
}: {
  orgId: string;
  employeeId: string;
  initialUrl: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function onUpload(file: File) {
    setError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${orgId}/employees/${employeeId}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      setError(upErr.message);
      return;
    }

    const { data: signed } = await supabase.storage
      .from("avatars")
      .createSignedUrl(path, 60 * 60 * 24 * 30);
    const newUrl = signed?.signedUrl ?? path;
    setUrl(newUrl);
    startTransition(() => setEmployeePhoto(employeeId, path));
  }

  function onRemove() {
    if (!confirm("Удалить фото?")) return;
    setUrl(null);
    startTransition(() => setEmployeePhoto(employeeId, null));
  }

  return (
    <div className="surface p-5">
      <div className="mb-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        Фото сотрудника
      </div>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-md border border-[color:var(--rule)] bg-[#f4f5ef]">
          {url ? (
            <Image
              src={url}
              alt="avatar"
              fill
              sizes="96px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
              нет
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[13px] hover:border-[color:var(--ink)]"
          >
            <Upload className="h-3.5 w-3.5" />
            {url ? "Заменить" : "Загрузить"}
          </button>
          {url && (
            <button
              type="button"
              onClick={onRemove}
              disabled={pending}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-red-200 bg-white px-3 text-[13px] text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Удалить
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
          }}
        />
      </div>
      {error && (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
