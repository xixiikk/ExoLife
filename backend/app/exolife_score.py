from math import isfinite, log, sqrt

from app.habitability import calculate_interior_esi
from app.habitable_zone import calculate_habitable_zone


def calculate_flux_score(insolation, inner_flux, outer_flux):
    """
    Близость потока к геометрическому центру зоны.
    1 — центр; 0 — граница или за пределами зоны.
    """
    values = [insolation, inner_flux, outer_flux]

    if any(
        v is None
        or not isinstance(v, (int, float))
        or not isfinite(v)
        or v <= 0
        for v in values
    ):
        return None

    if inner_flux <= outer_flux:
        return None

    center = sqrt(inner_flux * outer_flux)
    half_width = log(inner_flux / outer_flux) / 2

    distance = abs(log(insolation / center))
    return max(0.0, 1.0 - distance / half_width)


def build_exolife_ranking(planets, limit=50):
    ranking = []

    for planet in planets:
        radius = planet.get("pl_rade")
        mass = planet.get("pl_bmasse")
        insolation = planet.get("pl_insol")
        star_temp = planet.get("st_teff")

        # Только полная оценка массы, не минимальная M*sin(i).
        if planet.get("pl_bmassprov") != "Mass":
            continue

        if radius is None or mass is None:
            continue

        if not all(
            isinstance(v, (int, float))
            and isfinite(v)
            and v > 0
            for v in [radius, mass]
        ):
            continue

        # Предварительный отбор относительно небольших планет.
        if radius > 2 or mass > 10:
            continue

        zone = calculate_habitable_zone(
            insolation, star_temp
        )

        if zone["status"] != "in_zone":
            continue

        interior_esi = calculate_interior_esi(
            radius, mass
        )

        if interior_esi is None:
            continue

        flux_score = calculate_flux_score(
            insolation,
            zone["inner_flux"],
            zone["outer_flux"],
        )

        if flux_score is None:
            continue

        exolife_score = (
            0.7 * interior_esi
            + 0.3 * flux_score
        )

        ranking.append({
            "name": planet.get("pl_name"),
            "hostname": planet.get("hostname"),
            "radius": radius,
            "mass": mass,
            "insolation": insolation,
            "stellar_temperature": star_temp,
            "eccentricity": planet.get("pl_orbeccen"),
            "zone_status": zone["status"],
            "interior_esi": interior_esi,
            "flux_score": round(flux_score, 4),
            "exolife_score": round(exolife_score, 4),
        })

    ranking.sort(
        key=lambda p: p["exolife_score"],
        reverse=True,
    )

    return ranking[:limit]