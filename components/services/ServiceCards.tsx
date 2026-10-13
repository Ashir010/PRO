import { services } from "@/data/services";
import { ServiceCard } from "@/components/services/ServiceCard";

export function ServiceCards() {
  return (
    <div className="shell">
      <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.id} className="flex">
            <ServiceCard service={service} />
          </li>
        ))}
      </ul>
    </div>
  );
}
