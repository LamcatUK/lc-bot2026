import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, SelectControl, ToggleControl, RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { brushTop, spaceTop, spaceBottom, title, category, count, seeAllText, seeAllUrl, surface, showImages } = attributes;
	const blockProps = useBlockProps( { className: 'container lc-bot2026-editor-block' } );
	const terms = useSelect( ( select ) => select( coreStore ).getEntityRecords( 'taxonomy', 'product_cat', { per_page: 100, hide_empty: false } ), [] );
	const options = [ { value: '', label: __( 'All hikes', 'lc-bot2026' ) }, ...( terms || [] ).filter( ( t ) => 'uncategorized' !== t.slug ).map( ( t ) => ( { value: t.slug, label: t.name } ) ) ];
	const spaceOptions = [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ];

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="Upcoming Hikes" textDomain="lc-bot2026">
			<p>{ __( 'Hikes are WooCommerce products set up with FooEvents. Only hikes dated today or later are shown, soonest first.', 'lc-bot2026' ) }</p>
			<TextControl label={ __( 'Heading', 'lc-bot2026' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
			<SelectControl label={ __( 'Show', 'lc-bot2026' ) } value={ category } options={ options } onChange={ ( v ) => setAttributes( { category: v } ) } />
			<RangeControl label={ __( 'How many (0 = all)', 'lc-bot2026' ) } value={ count } min={ 0 } max={ 24 } onChange={ ( v ) => setAttributes( { count: v } ) } />
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><TextControl label={ __( 'Button text (optional)', 'lc-bot2026' ) } value={ seeAllText } onChange={ ( v ) => setAttributes( { seeAllText: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><TextControl type="url" label={ __( 'Button address (blank = no button)', 'lc-bot2026' ) } value={ seeAllUrl } onChange={ ( v ) => setAttributes( { seeAllUrl: v } ) } /></div>
			</div>
			<SelectControl label={ __( 'Surface', 'lc-bot2026' ) } value={ surface } options={ [ { value: 'surface', label: 'Page (light)' }, { value: 'tint', label: 'Tint' }, { value: 'soft', label: 'Soft accent' }, { value: 'brand', label: 'Brand (dark)' } ] } onChange={ ( v ) => setAttributes( { surface: v } ) } />
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space above', 'lc-bot2026' ) } value={ spaceTop || 'normal' } options={ spaceOptions } onChange={ ( v ) => setAttributes( { spaceTop: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space below', 'lc-bot2026' ) } value={ spaceBottom || 'normal' } options={ spaceOptions } onChange={ ( v ) => setAttributes( { spaceBottom: v } ) } /></div>
			</div>
			<ToggleControl label={ __( 'Show each hike\'s photo', 'lc-bot2026' ) } help={ __( 'Uses the hike\'s featured image, on wider screens.', 'lc-bot2026' ) } checked={ showImages !== false } onChange={ ( v ) => setAttributes( { showImages: v } ) } />
			<ToggleControl label={ __( 'Brush edge at the top', 'lc-bot2026' ) } checked={ !! brushTop } onChange={ ( v ) => setAttributes( { brushTop: v } ) } />
		</EditorBlockShell>
	);
}
